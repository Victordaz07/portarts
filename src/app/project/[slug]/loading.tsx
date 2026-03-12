import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProjectLoading() {
  return (
    <div className="py-24 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
