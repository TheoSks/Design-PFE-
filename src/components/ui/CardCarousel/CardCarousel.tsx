import styles from './CardCarousel.module.css';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { IconChevronRight } from '@/components/icons';
import { CardProvider } from '@/components/ui/Card/CardContext';

interface CardCarouselProps {
  title: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CardCarousel({
  title,
  onSeeAll,
  children,
  className,
}: CardCarouselProps) {
  return (
    <section className={cn(styles.section, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {onSeeAll && (
          <Button
            variant="tertiary"
            iconRight={<IconChevronRight size={14} />}
            onClick={onSeeAll}
            className={styles.seeAllButton}
          >
            Voir tout
          </Button>
        )}
      </div>
      <div className={styles.scrollArea}>
        <div className={styles.scrollInner}>
          {/* Cards inside a horizontal carousel use vertical swipe for image change
              to avoid conflict with the carousel's native horizontal scroll. */}
          <CardProvider swipeDirection="vertical">
            {children}
          </CardProvider>
        </div>
      </div>
    </section>
  );
}
