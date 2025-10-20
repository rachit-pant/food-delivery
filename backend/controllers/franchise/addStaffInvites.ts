import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { Resend } from 'resend';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
const FRONTEND_URL = 'http://localhost:3000';

const addStaffInvites = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      email: z.email(),
      franchiseId: z.coerce.number(),
      role: z.coerce.number(),
    });
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      throw new BetterError(
        'Invalid email or franchiseId or role',
        400,
        'INVALID_EMAIL_OR_FRANCHISE_ID_OR_ROLE',
        'Missing required fields'
      );
    }
    const { email, franchiseId, role } = validation.data;
    const existingInvite = await prisma.staffInvite.findFirst({
      where: {
        email: email,
        franchiseId: franchiseId,
        roleId: role,
        status: 'PENDING',
      },
    });

    if (existingInvite) {
      throw new BetterError(
        'Invite already sent',
        400,
        'DUPLICATE_INVITE',
        'This user already has a pending invite.'
      );
    }
    const existingInviteFranchise = await prisma.staffInvite.findFirst({
      where: {
        email: email,
        franchiseId: franchiseId,
        status: 'PENDING',
      },
    });

    if (existingInviteFranchise) {
      throw new BetterError(
        'In a franchise already sent',
        400,
        'DUPLICATE_INVITE',
        'This user already has a pending invite.'
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.staffInvite.create({
      data: {
        email: email,
        token: tokenHash,
        franchiseId: franchiseId,
        roleId: role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const user = await prisma.users.findUnique({
      where: { email: email },
    });
    console.log('email', email);
    console.log('user', user);
    const inviteUrl = user
      ? `${FRONTEND_URL}/invites/eu?token=${token}`
      : `${FRONTEND_URL}/invites/cu?token=${token}`;
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #111827; margin-bottom: 16px;">You’ve been invited!</h2>
      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        Hello,<br><br>
        You’ve been invited to join our team. Please click the button below to accept your invitation:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
          Accept Invitation
        </a>
      </div>
      <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
        If you did not expect this invitation, you can safely ignore this email.
      </p>
      <hr style="margin: 24px 0; border: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        © ${new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </div>
  </div>
`;
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'You have been invited to join our team',
        html,
      });
    } catch (err) {
      throw new BetterError(
        'Failed to send invite email',
        500,
        'EMAIL_ERROR',
        (err as Error).message
      );
    }
    console.time('addStaffInvites');
    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully',
      data: { email, franchiseId, roleId: role },
    });
  }
);

export default addStaffInvites;
