import { useRouter } from 'next/navigation'  // for App Router
import { createClient } from '@supabase/supabase-js'

// const router = useRouter()
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

const supabaseClientLogin = async (email: string, password: string) =>{
    const {data,error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    }).then(({data, error}) => {
        return {data, error}
    })
    return {data,error}
}

const supabaseClientSignup = async (email: string, password: string)=> {
    const { data, error } = await supabase.auth.signUp({ email, password })
  .then(({ data, error }) => {
    return { data, error }
  })
  return { data, error }
    // router.push('/sing-in')
  }

export  {supabaseClientLogin, supabaseClientSignup}