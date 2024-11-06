import { passthrough, type ResponseResolver } from "msw";

type Predicate = (searchParams: URLSearchParams) => boolean;
type Args = { request: Request; requestId: string };

export const withSearchParams =
  (predicate: Predicate, resolver: ResponseResolver) => (args: Args) => {
    const { request } = args;
    const url = new URL(request.url);

    if (!predicate(url.searchParams)) {
      return passthrough();
    }

    return resolver(args);
  };
