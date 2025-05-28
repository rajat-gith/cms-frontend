// src/lib/auth.ts
import axios from "./axios";
import { cookies } from "next/headers";

export async function getCurrentUser() {
	try {
		const cookieStore = cookies();
		const token = (await cookieStore).get("token")?.value;

		if (!token) return null;

		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (!res.ok) return null;

		const user = await res.json();
		return user;
	} catch (err) {
		console.error("Failed to fetch current user:", err);
		return null;
	}
}
