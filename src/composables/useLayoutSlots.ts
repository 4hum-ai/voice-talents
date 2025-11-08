import { ref, provide, inject, type Ref, type VNode } from 'vue'

const LAYOUT_SLOTS_KEY = Symbol('layout-slots')

interface LayoutSlots {
  title: Ref<string | VNode | null>
  subtitle: Ref<string | VNode | null>
  actions: Ref<VNode | VNode[] | null>
}

export function useLayoutSlots() {
  const slots = inject<LayoutSlots>(LAYOUT_SLOTS_KEY)

  if (!slots) {
    // If not provided, create a local instance (for views that don't use layouts)
    const title = ref<string | VNode | null>(null)
    const subtitle = ref<string | VNode | null>(null)
    const actions = ref<VNode | VNode[] | null>(null)

    return {
      setTitle: (value: string | VNode | null) => {
        title.value = value
      },
      setSubtitle: (value: string | VNode | null) => {
        subtitle.value = value
      },
      setActions: (value: VNode | VNode[] | null) => {
        actions.value = value
      },
      title,
      subtitle,
      actions,
    }
  }

  return {
    setTitle: (value: string | VNode | null) => {
      slots.title.value = value
    },
    setSubtitle: (value: string | VNode | null) => {
      slots.subtitle.value = value
    },
    setActions: (value: VNode | VNode[] | null) => {
      slots.actions.value = value
    },
    title: slots.title,
    subtitle: slots.subtitle,
    actions: slots.actions,
  }
}

export function provideLayoutSlots() {
  const title = ref<string | VNode | null>(null)
  const subtitle = ref<string | VNode | null>(null)
  const actions = ref<VNode | VNode[] | null>(null)

  provide(LAYOUT_SLOTS_KEY, {
    title,
    subtitle,
    actions,
  })

  return {
    title,
    subtitle,
    actions,
  }
}
