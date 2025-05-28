import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	const protectedRoutes = ["/dashboard"];

	if (
		protectedRoutes.some((path) =>
			request.nextUrl.pathname.startsWith(path)
		) &&
		!token
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}
