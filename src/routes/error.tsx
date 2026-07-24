export function loader() {
  throw new Response("Intentional platform-preview error", {
    status: 418,
    statusText: "Preview error",
  });
}

export default function UnreachableErrorRoute() {
  return null;
}
