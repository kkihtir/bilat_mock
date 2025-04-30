# Supabase Setup Guide for Staff Report App

This guide will walk you through setting up Supabase as a backend for the Staff Report App. Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, storage, and more.

## 1. Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account
2. Create a new project, give it a name (e.g., "staff-report-app")
3. Set a secure password for your database
4. Choose a region closest to your users
5. Wait for your project to be set up (this can take a few minutes)

## 2. Get Your Supabase Credentials

Once your project is created:

1. Go to your project dashboard
2. Click on the "Settings" icon (gear icon) in the sidebar
3. Click on "API" in the settings menu
4. Under "Project API keys", you'll find:
   - Project URL (labeled as "URL")
   - anon/public key (labeled as "anon key" or "public key")
5. Copy these values as you'll need them in the next step

## 3. Set Up Environment Variables

Create a file named `.env.local` in the root of your project and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied in the previous step.

## 4. Create Database Tables

Now, you'll need to create the necessary tables in your Supabase database:

### Countries Table

In the Supabase dashboard:

1. Go to the "Table Editor" in the sidebar
2. Click "New Table"
3. Set the following:
   - Name: `countries`
   - Columns:
     - `id` (uuid, primary key, default: uuid_generate_v4())
     - `code` (text, unique)
     - `name` (text)
     - `region` (text)
     - `capital` (text)
     - `created_at` (timestamp with time zone, default: now())
4. Click "Save"

### Users Table

1. Click "New Table"
2. Set the following:
   - Name: `users`
   - Columns:
     - `id` (uuid, primary key, default: uuid_generate_v4())
     - `name` (text)
     - `email` (text, unique)
     - `role` (text)
     - `created_at` (timestamp with time zone, default: now())
3. Click "Save"

### Reports Table

1. Click "New Table"
2. Set the following:
   - Name: `reports`
   - Columns:
     - `id` (uuid, primary key, default: uuid_generate_v4())
     - `title` (text)
     - `country_code` (text, references countries.code)
     - `date` (date)
     - `type` (text)
     - `status` (text, default: 'pending')
     - `description` (text)
     - `created_at` (timestamp with time zone, default: now())
     - `created_by_id` (uuid, references users.id)
     - `approved_by_id` (uuid, references users.id, nullable)
     - `tags` (text array, default: '{}')
3. Click "Save"

## 5. Add Some Sample Data

### Add Countries

1. Go to the "Table Editor" and select the `countries` table
2. Click "Insert" to add rows
3. Add several countries with their codes, for example:
   - `us` - United States
   - `gb` - United Kingdom
   - `fr` - France
   - `de` - Germany
   - `jp` - Japan
   - etc.

### Add Users

1. Select the `users` table
2. Add a few sample users with their names, emails, and roles

### Add Reports

1. Select the `reports` table
2. Add sample reports with titles, country codes, dates, etc.
3. Make sure to link them to existing users (created_by_id) and countries (country_code)

## 6. Testing Your Setup

After setting up your tables and adding sample data, your application should now be able to:

1. Fetch countries and display them in the countries list
2. Fetch reports and display them in the reports list
3. Create, update, and delete reports as needed

## Database Schema Documentation

### Countries Table
- `id`: UUID, primary key
- `code`: Text, country code (e.g., "us", "gb")
- `name`: Text, country name
- `region`: Text, region/continent
- `capital`: Text, capital city
- `created_at`: Timestamp when the record was created

### Users Table
- `id`: UUID, primary key
- `name`: Text, user's full name
- `email`: Text, user's email address
- `role`: Text, user's role in the system
- `created_at`: Timestamp when the record was created

### Reports Table
- `id`: UUID, primary key
- `title`: Text, report title
- `country_code`: Text, references countries.code
- `date`: Date of the report
- `type`: Text, type of report (e.g., "meeting", "informative")
- `status`: Text, approval status ("pending", "approved", "rejected")
- `description`: Text, report description
- `created_at`: Timestamp when the report was created
- `created_by_id`: UUID, references users.id
- `approved_by_id`: UUID, references users.id (null if not approved)
- `tags`: Text array, tags associated with the report

## Troubleshooting

- **Database Connection Issues**: Make sure your environment variables are correct and that your IP is allowed in Supabase.
- **CORS Errors**: Check Supabase API settings to ensure your domain is allowed.
- **Authentication Problems**: Verify that you're using the correct public/anon key.
- **Data Not Showing**: Check your database queries and console for errors. 