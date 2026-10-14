import { useEffect, useRef, useState } from "react";
import { copyText } from "../lib/clipboard.js";

// 복사 버튼: 성공하면 1.2초간 '복사됨'
export default function CopyButton({ getText, label = "복사", primary = false, onResult, ariaLabel }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(getText());
    if (ok) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1200);
    }
    onResult && onResult(ok);
  };

  return (
    <button type="button" className={primary ? "btn btn-primary" : "btn btn-small"} onClick={onClick} aria-label={ariaLabel}>
      {copied ? "복사됨" : label}
    </button>
  );
}
