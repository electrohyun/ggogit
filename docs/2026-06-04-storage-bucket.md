# 프로필 이미지 업로드 작업 순서

1. Supabase Storage 버킷을 만든다.
   - bucket: `profile-avatars`
   - public: `true`

2. Storage RLS 정책을 작성한다.
   - 이미지는 공개 조회 가능
   - 로그인 유저만 업로드 가능
   - 자기 `userId` 폴더에만 업로드/수정 가능

3. 프로필 수정 UI에 파일 선택을 연결한다.
   - 수정 모드에서 프로필 사진 클릭
   - 숨겨진 `input type="file"` 실행
   - 이미지 파일 선택

4. `uploadUserProfileAvatar` 서버 액션을 작성한다.
   - 현재 로그인 유저 확인
   - 파일 검증
   - Supabase Storage 업로드
   - public URL 생성
   - `profiles.avatar_url` 업데이트
   - `/profile` 재검증
   - `avatarUrl` 반환

5. 클라이언트 상태를 갱신한다.
   - `ProfileEditableFields`의 프로필 이미지 변경
   - Zustand `currentUser.avatarUrl` 변경

6. UI 상태를 처리한다.
   - 업로드 중 버튼 비활성화
   - 실패 메시지 표시
   - 성공 시 새 프로필 이미지 즉시 표시

7. 동작을 확인한다.
   - `pnpm build`
   - 프로필 이미지 선택 및 변경 확인
   - 헤더 프로필 이미지 변경 확인
