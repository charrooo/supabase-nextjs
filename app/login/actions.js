'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Redirect immediately on error
    redirect('/error')
    return // exit early
  }

  revalidatePath('/', 'layout') // Revalidate path before redirect
  redirect('/account') // Then redirect to account page
}

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // Redirect immediately on error
    redirect('/error')
    return // exit early
  }

  revalidatePath('/', 'layout') // Revalidate path before redirect
  redirect('/account') // Then redirect to account page
}
