import { prisma } from "./prisma";

/**
 * Log an admin action for audit trail.
 */
export async function logAdminAction(
  userId?: string,
  action: string = "UNKNOWN",
  detail: string = "",
  request?: Request
): Promise<void> {
  try {
    if (!userId) return;
    
    let ipAddress = "";
    let userAgent = "";

    if (request) {
      ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      userAgent = request.headers.get("user-agent") || "unknown";
    }

    await prisma.adminLog.create({
      data: {
        userId,
        action,
        detail,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
