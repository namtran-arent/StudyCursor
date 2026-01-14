import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client for server-side operations
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Create or update user in database
 * @param {Object} userData - User data from OAuth provider
 * @param {string} userData.id - User ID (from OAuth provider)
 * @param {string} userData.email - User email
 * @param {string} userData.name - User name
 * @param {string} userData.image - User profile picture URL
 * @returns {Promise<Object>} Created or updated user data
 */
export async function createOrUpdateUser(userData) {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    const { id, email, name, image } = userData;

    if (!id || !email) {
      console.error('Missing required user data: id or email');
      return null;
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('provider_id', id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing user:', fetchError);
      return null;
    }

    const userPayload = {
      provider_id: id,
      email: email.toLowerCase().trim(),
      name: name || null,
      image: image || null,
      last_login_at: new Date().toISOString(),
    };

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          name: userPayload.name,
          image: userPayload.image,
          last_login_at: userPayload.last_login_at,
        })
        .eq('provider_id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return null;
      }

      console.log('User updated:', updatedUser.email);
      return updatedUser;
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([userPayload])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return null;
      }

      console.log('New user created:', newUser.email);
      return newUser;
    }
  } catch (error) {
    console.error('Exception in createOrUpdateUser:', error);
    return null;
  }
}

/**
 * Get user by provider ID
 * @param {string} providerId - OAuth provider user ID
 * @returns {Promise<Object|null>} User data or null
 */
export async function getUserByProviderId(providerId) {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('provider_id', providerId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in getUserByProviderId:', error);
    return null;
  }
}
