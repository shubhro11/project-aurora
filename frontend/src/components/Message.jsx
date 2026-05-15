import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

const Message = ({ message }) => {
  const rawDateData = new Date(message.createdAt);

  return (
    <div
      className={`flex flex-col gap-1.5 ${
        message.role === "user" ? "items-end" : "items-start"
      }`}
    >
      <small className="text-[0.7rem] leading-none text-(--color-on-surface-variant) uppercase opacity-70">
        {message.role === "user" ? "You" : "Aurora"}
      </small>

      <div
        className={`mt-1 rounded-md ${
          message.role === "user"
            ? "w-fit max-w-135 rounded-br-sm bg-(--color-on-primary-fixed-variant) px-4 py-3 text-(--color-on-primary-container) "
            : "w-fit max-w-full rounded-bl-sm border border-(--color-surface-container-high) bg-(--color-surface-container) px-4 py-4 text-(--color-on-surface)"
        }`}
      >
        {message.role === "model" ? (
          <div className="prose dark:prose-invert prose-p:leading-7 prose-p:my-4 prose-li:my-2 prose-headings:mt-6 prose-headings:mb-4 prose-table:block prose-table:overflow-x-auto prose-th:border prose-th:px-3 prose-th:py-2 prose-td:border prose-td:px-3 prose-td:py-2 prose-pre:rounded-xl prose-pre:px-4 prose-pre:py-3 max-w-none text-sm wrap-break-word whitespace-pre-wrap">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm wrap-break-word">{message.content}</p>
        )}
      </div>

      <small className="text-[0.7rem] leading-none text-(--color-on-surface-variant) opacity-60">
        {rawDateData.toLocaleTimeString()} • {rawDateData.toLocaleDateString()}
      </small>
    </div>
  );
};

export default Message;
