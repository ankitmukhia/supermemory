// @ts-nocheck

import cheerio from "cheerio";

export async function unfurl(url: string) {
	const response = await fetch(url);
	if (response.status >= 400) {
		throw new Error(`Error fetching url: ${response.status}`);
	}
	const contentType = response.headers.get("content-type");
	if (!contentType?.includes("text/html")) {
		throw new Error(`Content-type not right: ${contentType}`);
	}

	const content = await response.text();
	const $ = cheerio.load(content);

	const og: { [key: string]: string | undefined } = {};
	const twitter: { [key: string]: string | undefined } = {};
	// @ts-ignore trust
	$("meta[property^=og:]").each(
		(_, el) => (og[$(el).attr("property")!] = $(el).attr("content")),
	);
	// @ts-ignore trust
	$("meta[name^=twitter:]").each(
		(_, el) => (twitter[$(el).attr("name")!] = $(el).attr("content")),
	);

	const title =
		og["og:title"] ??
		twitter["twitter:title"] ??
		$("title").text() ??
		undefined;
	const description =
		og["og:description"] ??
		twitter["twitter:description"] ??
		$('meta[name="description"]').attr("content") ??
		undefined;
	const image =
		og["og:image:secure_url"] ??
		og["og:image"] ??
		twitter["twitter:image"] ??
		undefined;
	const favicon =
		$('link[rel="apple-touch-icon"]').attr("href") ??
		$('link[rel="icon"]').attr("href") ??
		undefined;

	return {
		title,
		description,
		image,
		favicon,
	};
}
