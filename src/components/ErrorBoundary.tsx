import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 text-2xl font-bold border border-sky-100">
              ✦
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">Sayfa Yüklenirken Bir Sorun Oluştu</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Geçici bir yükleme hatası meydana geldi. Sayfayı yenileyerek devam edebilirsiniz.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500 shadow-md transition-all text-sm"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
