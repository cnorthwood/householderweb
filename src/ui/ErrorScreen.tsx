import React from "react";

export default function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="container my-4">
      <div className="message is-danger">
        <div className="message-header">An unexpected error occurred</div>
        <div className="message-body">{message}</div>
      </div>
    </div>
  );
}
