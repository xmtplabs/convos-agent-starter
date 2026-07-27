import {
  createLibrary,
  defineComponent,
  useTriggerAction,
  type ActionPlan,
  type ComponentRenderProps,
} from "@openuidev/react-lang";
import { z } from "zod";

const children = z.array(z.any()).optional();
const className = z.string().optional();

export function toMountUrl(value: string): string {
  if (
    value.startsWith("#") ||
    value.startsWith("?") ||
    /^[a-z][a-z0-9+.-]*:/i.test(value) ||
    value.startsWith("//")
  ) {
    return value;
  }
  if (value === "/") return ".";
  return value.startsWith("/") ? value.slice(1) : value;
}

const pageSchema = z.object({
  title: z.string(),
  children,
  className,
});
const Page = defineComponent({
  name: "Page",
  description:
    "The required root component for a complete page. Its title names the document but does not add a visible heading; include exactly one Heading at level 1.",
  props: pageSchema,
  component: ({
    props,
    renderNode,
  }: ComponentRenderProps<z.infer<typeof pageSchema>>) => (
    <main className={["page", props.className].filter(Boolean).join(" ")}>
      {renderNode(props.children)}
    </main>
  ),
});

const sectionSchema = z.object({
  heading: z.string().nullable().optional(),
  tone: z.enum(["plain", "muted", "accent"]).default("plain"),
  children,
  className,
});
const Section = defineComponent({
  name: "Section",
  description:
    "A semantic page section. Give it a heading when it starts a distinct topic.",
  props: sectionSchema,
  component: ({
    props,
    renderNode,
  }: ComponentRenderProps<z.infer<typeof sectionSchema>>) => (
    <section
      className={[
        "section",
        `section--${props.tone}`,
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {props.heading ? <h2>{props.heading}</h2> : null}
      {renderNode(props.children)}
    </section>
  ),
});

const stackSchema = z.object({
  gap: z.enum(["sm", "md", "lg", "xl"]).default("md"),
  children,
  className,
});
const Stack = defineComponent({
  name: "Stack",
  description: "Vertically stacks related content with a consistent gap.",
  props: stackSchema,
  component: ({
    props,
    renderNode,
  }: ComponentRenderProps<z.infer<typeof stackSchema>>) => (
    <div
      className={["stack", `stack--${props.gap}`, props.className]
        .filter(Boolean)
        .join(" ")}
    >
      {renderNode(props.children)}
    </div>
  ),
});

const gridSchema = z.object({
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(2),
  children,
  className,
});
const Grid = defineComponent({
  name: "Grid",
  description: "A responsive grid for peer content such as cards or statistics.",
  props: gridSchema,
  component: ({
    props,
    renderNode,
  }: ComponentRenderProps<z.infer<typeof gridSchema>>) => (
    <div
      className={["grid", `grid--${props.columns}`, props.className]
        .filter(Boolean)
        .join(" ")}
    >
      {renderNode(props.children)}
    </div>
  ),
});

const headingSchema = z.object({
  text: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  children,
  className,
});
const Heading = defineComponent({
  name: "Heading",
  description:
    "A visible heading. Every page must contain exactly one level-1 Heading.",
  props: headingSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof headingSchema>>) => {
    const Tag = `h${props.level}` as "h1" | "h2" | "h3";
    return <Tag className={props.className}>{props.text}</Tag>;
  },
});

const textSchema = z.object({
  text: z.string(),
  tone: z.enum(["default", "muted", "small"]).default("default"),
  children,
  className,
});
const Text = defineComponent({
  name: "Text",
  description: "A paragraph of supporting copy.",
  props: textSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof textSchema>>) => (
    <p
      className={["text", `text--${props.tone}`, props.className]
        .filter(Boolean)
        .join(" ")}
    >
      {props.text}
    </p>
  ),
});

const linkSchema = z.object({
  href: z.string(),
  text: z.string(),
  newTab: z.boolean().default(false),
  children,
  className,
});
const Link = defineComponent({
  name: "Link",
  description:
    "A mount-aware navigational link. Use a slash-prefixed local path for another page in this site.",
  props: linkSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof linkSchema>>) => (
    <a
      className={props.className}
      href={toMountUrl(props.href)}
      target={props.newTab ? "_blank" : undefined}
      rel={props.newTab ? "noreferrer" : undefined}
    >
      {props.text}
    </a>
  ),
});

const cardSchema = z.object({
  title: z.string().nullable().optional(),
  children,
  className,
});
const Card = defineComponent({
  name: "Card",
  description: "A bordered surface for grouped information.",
  props: cardSchema,
  component: ({
    props,
    renderNode,
  }: ComponentRenderProps<z.infer<typeof cardSchema>>) => (
    <article className={["card", props.className].filter(Boolean).join(" ")}>
      {props.title ? <h3>{props.title}</h3> : null}
      {renderNode(props.children)}
    </article>
  ),
});

const badgeSchema = z.object({
  text: z.string(),
  tone: z.enum(["neutral", "success", "warning", "danger"]).default("neutral"),
  children,
  className,
});
const Badge = defineComponent({
  name: "Badge",
  description: "A compact status label.",
  props: badgeSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof badgeSchema>>) => (
    <span
      className={["badge", `badge--${props.tone}`, props.className]
        .filter(Boolean)
        .join(" ")}
    >
      {props.text}
    </span>
  ),
});

const alertSchema = z.object({
  title: z.string(),
  description: z.string(),
  tone: z.enum(["info", "success", "warning", "danger"]).default("info"),
  children,
  className,
});
const Alert = defineComponent({
  name: "Alert",
  description:
    "A concise status message. Danger alerts are assertive; other tones announce politely.",
  props: alertSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof alertSchema>>) => (
    <aside
      className={["alert", `alert--${props.tone}`, props.className]
        .filter(Boolean)
        .join(" ")}
      role={props.tone === "danger" ? "alert" : "status"}
      aria-live={props.tone === "danger" ? "assertive" : "polite"}
    >
      <strong>{props.title}</strong>
      <p>{props.description}</p>
    </aside>
  ),
});

const separatorSchema = z.object({ children, className });
const Separator = defineComponent({
  name: "Separator",
  description: "A visual divider between related sections.",
  props: separatorSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof separatorSchema>>) => (
    <hr className={props.className} />
  ),
});

const buttonSchema = z.object({
  href: z.string().nullable().optional(),
  text: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("primary"),
  action: z.any().optional(),
  children,
  className,
});
const Button = defineComponent({
  name: "Button",
  description:
    "A mount-aware navigation button, or an explicit action button when action is supplied. Mutations run only after visitor activation.",
  props: buttonSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof buttonSchema>>) => {
    const triggerAction = useTriggerAction();
    const action = props.action as ActionPlan | undefined;
    const classes = ["button", `button--${props.variant}`, props.className]
      .filter(Boolean)
      .join(" ");
    if (action) {
      return (
        <button
          className={classes}
          type="button"
          onClick={() => void triggerAction(props.text, undefined, action)}
        >
          {props.text}
        </button>
      );
    }
    return (
      <a className={classes} href={toMountUrl(props.href ?? "/")}>
        {props.text}
      </a>
    );
  },
});

const inputSchema = z.object({
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  type: z.enum(["text", "email", "url", "number"]).default("text"),
  required: z.boolean().default(false),
  children,
  className,
});
const Input = defineComponent({
  name: "Input",
  description: "A labeled single-line form input.",
  props: inputSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof inputSchema>>) => (
    <label className={props.className}>
      {props.label}
      <input
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        required={props.required}
      />
    </label>
  ),
});

const textareaSchema = z.object({
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  children,
  className,
});
const Textarea = defineComponent({
  name: "Textarea",
  description: "A labeled multi-line form input.",
  props: textareaSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof textareaSchema>>) => (
    <label className={props.className}>
      {props.label}
      <textarea
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
      />
    </label>
  ),
});

const selectSchema = z.object({
  label: z.string(),
  name: z.string(),
  options: z.array(z.object({ label: z.string(), value: z.string() })),
  required: z.boolean().default(false),
  children,
  className,
});
const Select = defineComponent({
  name: "Select",
  description: "A labeled native select input.",
  props: selectSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof selectSchema>>) => (
    <label className={props.className}>
      {props.label}
      <select name={props.name} required={props.required}>
        {props.options.map((option: { label: string; value: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  ),
});

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  children,
  className,
});
const Image = defineComponent({
  name: "Image",
  description:
    "A mount-aware image with required alternative text. Slash-prefixed local sources resolve inside this site mount.",
  props: imageSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof imageSchema>>) => (
    <figure className={props.className}>
      <img src={toMountUrl(props.src)} alt={props.alt} />
      {props.caption ? <figcaption>{props.caption}</figcaption> : null}
    </figure>
  ),
});

const listSchema = z.object({
  items: z.array(z.string()),
  ordered: z.boolean().default(false),
  children,
  className,
});
const List = defineComponent({
  name: "List",
  description: "A semantic ordered or unordered list.",
  props: listSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof listSchema>>) => {
    const items = props.items.map((item: string) => <li key={item}>{item}</li>);
    return props.ordered ? (
      <ol className={props.className}>{items}</ol>
    ) : (
      <ul className={props.className}>{items}</ul>
    );
  },
});

const tableSchema = z.object({
  caption: z.string(),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  children,
  className,
});
const Table = defineComponent({
  name: "Table",
  description: "A compact, accessible data table.",
  props: tableSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof tableSchema>>) => (
    <table className={props.className}>
      <caption>{props.caption}</caption>
      <thead>
        <tr>
          {props.columns.map((column: string) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row: string[], rowIndex: number) => (
          <tr key={rowIndex}>
            {row.map((cell: string, cellIndex: number) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
});

const loadingSchema = z.object({
  label: z.string().default("Loading page…"),
  children,
  className,
});
const Loading = defineComponent({
  name: "Loading",
  description: "A loading state while page content is being fetched.",
  props: loadingSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof loadingSchema>>) => (
    <p
      className={["state", props.className].filter(Boolean).join(" ")}
      aria-live="polite"
    >
      {props.label}
    </p>
  ),
});

const messageStateSchema = z.object({
  title: z.string(),
  description: z.string(),
  children,
  className,
});
const Empty = defineComponent({
  name: "Empty",
  description: "An empty state when there is no content to show.",
  props: messageStateSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof messageStateSchema>>) => (
    <section className={["state", props.className].filter(Boolean).join(" ")}>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </section>
  ),
});

const staleSchema = z.object({
  text: z
    .string()
    .default("Showing the last available version while we reconnect."),
  children,
  className,
});
const Stale = defineComponent({
  name: "Stale",
  description:
    "A notice that the visible page is the last successfully loaded version.",
  props: staleSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof staleSchema>>) => (
    <p
      className={["notice", props.className].filter(Boolean).join(" ")}
      role="status"
    >
      {props.text}
    </p>
  ),
});

const ErrorState = defineComponent({
  name: "ErrorState",
  description: "An assertive, recoverable page error state.",
  props: messageStateSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof messageStateSchema>>) => (
    <section
      className={["state", "state--error", props.className]
        .filter(Boolean)
        .join(" ")}
      role="alert"
      aria-live="assertive"
    >
      <h1>{props.title}</h1>
      <p>{props.description}</p>
    </section>
  ),
});

const components = [
  Page,
  Section,
  Stack,
  Grid,
  Heading,
  Text,
  Link,
  Card,
  Badge,
  Alert,
  Separator,
  Button,
  Input,
  Textarea,
  Select,
  Image,
  List,
  Table,
  Loading,
  Empty,
  Stale,
  ErrorState,
];

/** Creates the exact component catalogue used by browser and server runtimes. */
export function createSiteLibrary() {
  return createLibrary({ root: "Page", components });
}

export const library = createSiteLibrary();
export const siteLibrary = library;
