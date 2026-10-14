// 하단 알림
export default function Toast({ toast }) {
  return (
    <div className="toast-wrap" aria-live="polite" role="status">
      {toast && (
        <div key={toast.id} className="toast">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
