import { ComponentType } from 'react';

import { ErrorDisplay } from '@/components/error-display/error-display';

type Props = {
  title: string;
  text: string;
  className?: string;
  primaryAction: ComponentType<object>;
  secondaryAction: ComponentType<object>;
};

export function PageErrorDisplay({
  title,
  text,
  className,
  primaryAction: PrimaryAction,
  secondaryAction: SecondaryAction,
}: Props) {

  return (
    <ErrorDisplay
      className={className}
      title={title}
      text={text}
      primaryAction={<PrimaryAction />}
      secondaryAction={<SecondaryAction />}
      titleTypography={() => <p>{title}</p>}
      textTypography={() => <p>{text}</p>}
    />
  );
}
