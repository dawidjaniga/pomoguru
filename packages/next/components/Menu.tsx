import React from 'react'
import { Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MenuComponent () {
  const { pathname } = useRouter()

  return (
    <Menu theme='dark' mode='horizontal' selectedKeys={['/' + pathname]}>
      <Menu.Item key='/timer'>
        <Link href='/timer'>Timer</Link>
      </Menu.Item>
      <Menu.Item key='/settings'>
        <Link href='/settings'>Settings</Link>
      </Menu.Item>
    </Menu>
  )
}
