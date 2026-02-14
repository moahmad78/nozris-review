
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createOrganization } from "@/actions/onboarding";
import { Building2, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import OnboardingForm from "@/app/onboarding/onboarding-form";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // If user already has an organization, redirect to dashboard
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { organizationId: true }
    });

    if (user?.organizationId) {
        redirect("/dashboard");
    }

    return <OnboardingForm />;
}
