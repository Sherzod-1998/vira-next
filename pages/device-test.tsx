// pages/device-test.tsx
import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';

const DeviceTest: NextPage = () => {
	const device = useDeviceDetect();

	if (typeof window !== 'undefined') {
		console.log('[DeviceTest] device =', device, 'innerWidth =', window.innerWidth);
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				background: '#111',
				color: '#fff',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 18,
				gap: 16,
			}}
		>
			<div>Device: <strong>{device}</strong></div>
			<div>Width: <strong>{typeof window !== 'undefined' ? window.innerWidth : 'SSR'}</strong></div>
		</div>
	);
};

export default DeviceTest;
