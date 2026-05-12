import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught:", error, info)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Beklenmeyen bir hata oluştu
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sayfayı yenilemeyi deneyebilir ya da geri dönüp tekrar deneyebilirsiniz.
            </p>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <pre className="mt-4 text-xs text-left text-pink-700 whitespace-pre-wrap bg-pink-50 p-3 rounded max-w-xl mx-auto overflow-auto">
                {String(this.state.error?.message || this.state.error)}
              </pre>
            )}
            <div className="mt-6 flex gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Tekrar dene
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Sayfayı yenile
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
