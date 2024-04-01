import React, { Suspense } from 'react'
import { MatxLoading } from 'app/helpers/components/index'

const MatxSuspense = ({ children }) => {
    return <Suspense fallback={<MatxLoading />}>{children}</Suspense>
}

export default MatxSuspense
