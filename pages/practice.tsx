
import Head from "next/head";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import MainContent from '../components/dashboard/practice/MainContent';
import PricingModal from '../components/dashboard/practice/PricingModal';
import Layout from "../components/dashboard/Layout";
import LoadingScreen from '../components/LoadingScreen';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Practice() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { status } = useSession();
  const { data, error } = useSWR(status === 'authenticated' ? '/api/user' : null, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && data && !data.user?.practiceProfile) {
      router.replace('/login');
    }
  }, [status, router, data]);

  if (status === 'loading' || !data || !data.user) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;

  return (
    <Layout title="Practice">
      <Head>
        <title>Practice - PrepKitty</title>
      </Head>
      <ToastContainer />
      <div className="w-full max-w-7xl mx-auto pb-32">
        <MainContent user={user} />
        {showPricingModal && <PricingModal setShowPricingModal={setShowPricingModal} />}
      </div>
    </Layout>
  );
}
