export function loader() {
  return new Response("Convos agent site resource route\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
