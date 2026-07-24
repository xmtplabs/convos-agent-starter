import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function About() {
  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-6 py-16">
      <Badge variant="secondary">Mounted-route example</Badge>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        A full-stack site, inside the conversation
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        This nested route demonstrates client navigation and direct refreshes
        at every supported site mount depth.
      </p>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Platform preview checks</CardTitle>
          <CardDescription>
            These routes exercise redirects, resource responses, and error
            boundaries without adding application-specific infrastructure.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <a href="resource.txt">Open resource route</a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/redirect">Follow redirect</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/error">Open error boundary</Link>
          </Button>
        </CardContent>
      </Card>
      <Button asChild className="mt-8">
        <Link to="/">Back to group</Link>
      </Button>
    </main>
  );
}
