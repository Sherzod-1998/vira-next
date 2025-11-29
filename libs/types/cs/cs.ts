import { ReactNode } from "react";

 export interface CsInquiry {
	memberNick: ReactNode;
	_id: string;
	title: string;
	content: string;
	answer: string | null;
	status: string;
	userId: string;
	createdAt: string;
}

export interface InquiryListProps {
	status?: 'PENDING' | 'ANSWERED';
}