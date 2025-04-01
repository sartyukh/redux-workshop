import { ComponentType, ReactNode } from 'react';
import './styles.css';

type Props = {
  className?: string;
  title: string;
  text: string;
  titleTypography: ComponentType<object>;
  textTypography: ComponentType<object>;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

export function ErrorDisplay({
  className,
  title,
  text,
  titleTypography: TitleTypography,
  textTypography: TextTypography,
  primaryAction,
  secondaryAction,
}: Props) {
  return (
    <div className={`error-display ${className || ''}`}>
      <div className="error-display-content">
        <div className="error-display-text-container">
          <TitleTypography>{title}</TitleTypography>
          <TextTypography>{text}</TextTypography>
        </div>
        <div className="error-display-actions">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
    </div>
  );
}
