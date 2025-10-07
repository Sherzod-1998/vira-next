import React, { KeyboardEvent } from 'react';
import Typography from '@mui/material/Typography';

type Props = {
	src: string;
	label: string;
	count?: number;
	onClick?: () => void;
	className?: string;
	tabIndex?: number;
};

const GorgeousCollectionCard: React.FC<Props> = ({ src, label, count = 0, onClick, className, tabIndex = 0 }) => {
	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	};

	return (
		<div
			className={`circle-img-wrapper ${className ?? ''}`}
			role="button"
			tabIndex={tabIndex}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			aria-label={`${label} (${count} products)`}
		>
			<div className="circle-figure">
				<img src={src} alt={label} className="circle-img" />
			</div>

			<div className="circle-img-label">
				{label}
				<Typography className="label-count">({count} products)</Typography>
			</div>
		</div>
	);
};

export default GorgeousCollectionCard;
