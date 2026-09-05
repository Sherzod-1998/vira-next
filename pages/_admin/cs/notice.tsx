import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Typography, List, ListItem } from '@mui/material';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';

type NoticeStatusTab = 'ALL' | 'ACTIVE' | 'HIDDEN' | 'DELETE';

const AdminNoticePage: NextPage = () => {
	const [statusTab, setStatusTab] = useState<NoticeStatusTab>('ALL');

	const statusValue =
		statusTab === 'ALL' ? undefined : statusTab; // Pass the selected status to NoticeList.

	return (
		<Box component="div" className="content">
			<Typography variant="h2" className="tit" sx={{ mb: '24px' }}>
				Notice Management
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
						className={statusTab === 'ACTIVE' ? 'li on' : 'li'}
						onClick={() => setStatusTab('ACTIVE')}
					>
						Active
					</ListItem>
					<ListItem
						button
						className={statusTab === 'HIDDEN' ? 'li on' : 'li'}
						onClick={() => setStatusTab('HIDDEN')}
					>
						Hidden
					</ListItem>
					<ListItem
						button
						className={statusTab === 'DELETE' ? 'li on' : 'li'}
						onClick={() => setStatusTab('DELETE')}
					>
						Deleted
					</ListItem>
				</List>

				{/* NOTICE LIST */}
				<NoticeList status={statusValue} />
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminNoticePage);
