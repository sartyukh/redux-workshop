import { ReactNode } from 'react';

import './styles.css';

type Props = {
  errorDisplay: ReactNode;
  errorImage: ReactNode;
};

export function ErrorPageLayout({ errorDisplay, errorImage }: Props) {
  return (
    <div className="error-page-container">
      <div className="error-page-content">
        <div className="error-display-container">
          {errorDisplay}
        </div>
        <div className="error-image-container">
          {errorImage}
        </div>
      </div>
    </div>
  );
}
