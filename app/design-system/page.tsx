import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { DesignSystemPage as default } from "@/pages/design-system";

export const metadata = createPageMetadata({
  title: "디자인 시스템",
  description: "꼬깃의 색상, 폰트, 컴포넌트 스타일을 확인하는 디자인 시스템입니다.",
  noIndex: true,
  path: "/design-system",
});
