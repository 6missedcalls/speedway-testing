import React from "react";
import { Button } from "@sonr-io/nebula-react"
import LayoutBase from "../LayoutBase";

interface ErrorBoundaryProps {
    children: React.ReactNode
    navigate: any
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundary extends React.Component {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: any) {
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      console.error(error, errorInfo);
    }
  
    render() {
      if ((this.state as ErrorBoundaryState).hasError) {
        return (
            <LayoutBase>
                <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
                    <h1 className="text-custom-xl mb-4 font-extrabold">Sorry, something went wrong.</h1>
                    <Button
                        styling="text-[38px] font-extrabold px-8 py-8"
                        label='Go back'
                        onClick={() => { window.location.href = '/' }}
                    />
                </div>
            </LayoutBase>
        )
      }
  
      return (this.props as ErrorBoundaryProps).children; 
    }
  }

  export default ErrorBoundary