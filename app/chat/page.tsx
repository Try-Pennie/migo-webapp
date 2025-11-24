import type { FC } from 'react'
import React, { Suspense } from 'react'

import Main from '@/app/components'
import Loading from '@/app/components/base/loading'

const ChatPage: FC<any> = ({
  params,
}: any) => {
  return (
    <Suspense fallback={<Loading type='app' />}>
      <Main params={params} />
    </Suspense>
  )
}

export default React.memo(ChatPage)

