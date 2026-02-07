'use client'

import CategoryEditPage from '../[id]/edit/page'

export default function NewCategoryPage() {
    return <CategoryEditPage params={Promise.resolve({ id: 'new' })} />
}
