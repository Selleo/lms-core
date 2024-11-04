import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import { AuthenticationError } from "~/api/types";
import CustomErrorBoundary from "./ErrorBoundary";

export function BaseErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    if (error instanceof AuthenticationError) {
      const to =
        error.type === "unauthorized" ? "/login?session=expired" : "/login";
      navigate(to);
    }
  }, [error, navigate]);

  if (isRouteErrorResponse(error)) {
    return <CustomErrorBoundary stack={error.data} />;
  } else if (error instanceof Error) {
    return <CustomErrorBoundary stack={error.stack} />;
  } else {
    return <CustomErrorBoundary />;
  }
}
