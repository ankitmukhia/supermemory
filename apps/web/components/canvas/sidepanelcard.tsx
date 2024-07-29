import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { TwitterIcon, TypeIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

type CardType = string;

export default function Card({
	type,
	title,
	content,
	source,
}: {
	type: CardType;
	title: string;
	content: string;
	source?: string;
}) {
	const [ref, bounds] = useMeasure();
	const [isDragging, setIsDragging] = useState(false);

	const handleDragStart = (
		event: React.DragEvent<HTMLAnchorElement | HTMLDivElement>,
		dragSource: "icon" | "link" | "parent",
	) => {
		setIsDragging(true);

		switch (dragSource) {
			case "icon":
				event.dataTransfer.setData(
					"application/json",
					JSON.stringify({
						type,
						title,
						content,
						text: true,
					}),
				);
				break;
			case "link":
				event.dataTransfer.setData("text/plain", source || "");
				break;
			case "parent":
				event.dataTransfer.setData(
					"application/json",
					JSON.stringify({
						type,
						title,
						content,
						text: false,
					}),
				);
				break;
		}
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

	return (
		<motion.div animate={{ height: bounds.height }}>
			<div
				draggable
				onDragEnd={handleDragEnd}
				onDragStart={(e) => handleDragStart(e, "parent")}
				className={`rounded-lg hover:scale-[1.02] group cursor-grab scale-[0.98] select-none transition-all border-[#232c2f] hover:bg-[#232c32] ${
					isDragging ? "border-blue-600 border-dashed border-2" : ""
				}`}
			>
				<div ref={ref} className="flex gap-4 px-3 py-2 items-center">
					<a
						href={source}
						className={`${source && "cursor-pointer"}`}
						draggable
						onDragStart={(e) => {
							e.stopPropagation();
							handleDragStart(e, "icon");
						}}
					>
						<Icon type={type} />
					</a>
					<div>
						<h2>{title}</h2>
						<p className="group-hover:line-clamp-[12] transition-all line-clamp-3 text-gray-200">
							{content}
						</p>
						<a
							draggable
							href={source}
							className="line-clamp-[1] text-blue-500"
							onDragStart={(e) => {
								e.stopPropagation();
								handleDragStart(e, "link");
							}}
						>
							{source}
						</a>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function Icon({ type }: { type: CardType }) {
	return type === "note" ? (
		<TypeIcon />
	) : type === "page" ? (
		<GlobeAltIcon className="h-9 w-5" />
	) : (
		<TwitterIcon />
	);
}
