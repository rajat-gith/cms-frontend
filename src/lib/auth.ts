import axios from "./axios";
import { cookies } from "next/headers";

export async function getCurrentUser() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;

		if (!token) return null;

		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		// No need to check res.ok; if the request fails, axios throws.
		// You can check status if you want:
		if (res.status !== 200) return null;

		return res.data; // Axios response data is in res.data
	} catch (error) {
		// Handle errors or return null
		return null;
	}
}
