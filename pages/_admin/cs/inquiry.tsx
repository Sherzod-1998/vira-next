import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography, List, ListItem } from '@mui/material';
import { InquiryList } from '../../../libs/components/admin/cs/InquiryList';

type StatusTab = 'ALL' | 'PENDING' | 'ANSWERED';

const AdminInquiryPage: NextPage = () => {
	const [statusTab, setStatusTab] = useState<StatusTab>('ALL');

	return (
		<Box component="div" className="content">
			<Typography variant="h2" className="tit" sx={{ mb: '24px' }}>
				1:1 Inquiry Management
			</Typography>

			<Box component="div" className="table-wrap">
				{/* STATUS TABS */}
				<List className="tab-menu" sx={{ mb: 1 }}>
					<ListItem
						button
						className={statusTab === 'ALL' ? 'li on' : 'li'}
						onClick={() => setStatusTab('ALL')}
					>
						All
					</ListItem>
					<ListItem
						button
						className={statusTab === 'PENDING' ? 'li on' : 'li'}
						onClick={() => setStatusTab('PENDING')}
					>
						Pending
					</ListItem>
					<ListItem
						button
						className={statusTab === 'ANSWERED' ? 'li on' : 'li'}
						onClick={() => setStatusTab('ANSWERED')}
					>
						Answered
					</ListItem>
				</List>

				{/* STATUS GA QARAB RO‘YXAT */}
				<InquiryList status={statusTab === 'ALL' ? undefined : statusTab} />
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminInquiryPage);
