type DetailsItemProps = {
  label: string;
  value: string;
};

export default function DetailsItem({ label, value }: DetailsItemProps) {
  return (
    <div className="v-column-divider relative">
      <dt className="ps-(--tracking-label) text-label font-bold tracking-label text-muted uppercase lg:ps-0 lg:text-label-lg">
        {label}
      </dt>
      <dd className="mt-1.75 min-h-6 text-value font-medium tracking-heading wrap-break-word text-ink lg:mt-3.25 lg:min-h-15 lg:text-value-lg">
        {value}
      </dd>
    </div>
  );
}
