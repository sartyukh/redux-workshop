import { PageErrorDisplay } from '@/components/error-display/page-error-display';
import { ErrorPageLayout } from '../layout/error-page-layout';

import './styles.css';
import { Link } from 'react-router';

const PrimaryAction = (props: object) => {
  return (
    <button {...props} >
      <Link
        to="/"
      >
        <p>На главную</p>
      </Link>
    </button>
  );
};

const SecondaryAction = (props: object) => (
  <button {...props}>
    <p>Обновить</p>
  </button>
);

export function NotFoundErrorPage() {
  return (
    <ErrorPageLayout
      errorDisplay={
        <PageErrorDisplay
          title={'Страница не найдена'}
          text={'Страница, которую вы ищете, не существует. Попробуйте использовать поиск или перейти на главную страницу.'}
          primaryAction={PrimaryAction}
          secondaryAction={SecondaryAction}
        />
      }
      errorImage={
        <img
          aria-hidden
          className="error-not-found-image"
          src={'/error-not-found.webp'}
          alt="not found"
        />
      }
    />
  );
}
