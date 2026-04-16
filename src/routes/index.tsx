import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SplashScreen } from "@/components/SplashScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartAssign Pro — Smart Assignment Management" },
      { name: "description", content: "A smart assignment tracking and submission management system for students, teachers, and administrators." },
      { property: "og:title", content: "SmartAssign Pro" },
      { property: "og:description", content: "Smart assignment tracking and submission management system." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <SplashScreen
      onComplete={(role) => {
        navigate({ to: "/login", search: { role } });
      }}
    />
  );
}
