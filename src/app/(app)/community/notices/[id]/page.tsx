interface NoticeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { id } = await params;

  return <div>공지사항 상세 #{id}</div>;
}
