type LoadingSpinnerProps = {
  size: string;
  color?: string;
};

const LoadingSpinner = ({ size, color }: LoadingSpinnerProps) => {
  const spinnerClass = `${size} animate-spin rounded-full border-4 border-solid ${
    color ?? "border-green-500"
  } border-t-transparent shadow-md`;
  return <div className={spinnerClass}></div>;
};

export default LoadingSpinner;
