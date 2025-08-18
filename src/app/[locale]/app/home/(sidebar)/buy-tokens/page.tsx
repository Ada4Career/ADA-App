'use client';

import { useState } from 'react';
import { CreditCard, ShieldCheck, Star, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdaCoin } from '@/components/ui/ada-coin';

interface TokenPlan {
  id: string;
  name: string;
  tokens: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
  description: string;
}

const BuyTokensPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tokenPlans: TokenPlan[] = [
    {
      id: 'free',
      name: 'Free Tier',
      tokens: 20,
      price: 0,
      description: 'Welcoming tokens to get you started',
      features: [
        'AI-powered job matching',
        'Basic AIDA assistance',
        'Standard CV builder access',
        'Valid for 3 days',
        'Perfect for trying premium features'
      ]
    },
    {
      id: 'intern',
      name: 'Intern Plan',
      tokens: 100,
      price: 2.9,
      description: 'Perfect for students and entry-level professionals',
      features: [
        'CV modification tokens',
        'AIDA token usage',
        'Premium job matching',
        'No commitment required',
        'Top-up anytime'
      ]
    },
    {
      id: 'jobseeker',
      name: 'Jobseeker Plan',
      tokens: 300,
      price: 9.9,
      popular: true,
      description: 'Most popular for active job seekers',
      features: [
        'Extended CV modifications',
        'Advanced AIDA assistance',
        'Premium career insights',
        'Priority job matching',
        'Top-up anytime',
        'Best value for money'
      ]
    },
    {
      id: 'winners',
      name: 'Winners Plan',
      tokens: 1000,
      price: 19.9,
      description: 'Maximum value for career champions',
      features: [
        'Unlimited CV modifications',
        'Full AIDA premium access',
        'Advanced analytics',
        'Priority support',
        'Career acceleration tools',
        'Top-up anytime'
      ]
    }
  ];

  const handlePurchase = async (planId: string) => {
    setIsProcessing(true);
    setSelectedPlan(planId);
    
    // Simulate payment processing
    try {
      // Demo: simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo success handling
      alert(`Demo: Purchase successful for ${planId} plan!`);
    } catch (error) {
      alert('Demo: Purchase simulation failed');
    } finally {
      setIsProcessing(false);
      setSelectedPlan('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AdaCoin size="lg" animated />
          <h1 className="text-3xl font-bold text-gray-900">
            Buy ADA Tokens
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Power your career journey with ADA tokens. Access premium features like CV modifications, 
          AIDA assistance, and advanced job matching. Pay as you use with our freemium system.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">CV Modifications</h3>
          <p className="text-gray-600">
            Use tokens to enhance and optimize your CV with AI-powered suggestions
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AIDA Assistance</h3>
          <p className="text-gray-600">
            Access premium AIDA features for personalized career guidance
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Pay as You Use</h3>
          <p className="text-gray-600">
            No monthly commitments - top up anytime and use tokens when needed
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tokenPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {plan.description}
              </CardDescription>
              
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                  )}
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${plan.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <AdaCoin size="sm" />
                  <span className="text-lg font-semibold text-amber-600">
                    {plan.tokens} ADA Tokens
                  </span>
                </div>
                {plan.id === 'free' && (
                  <div className="text-xs text-center text-gray-500 mt-1">
                    *Valid for 3 days
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-12"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePurchase(plan.id)}
                disabled={isProcessing}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {plan.price === 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Claim Free Tokens
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Purchase Plan
                      </>
                    )}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How ADA Tokens Work</h3>
          <p className="text-sm text-gray-600">
            Premium tokens are consumed for each use of premium features
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <AdaCoin size="sm" />
            <div>
              <span className="font-medium">CV Modification:</span>
              <p className="text-gray-600">1 token per AI-powered CV enhancement</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AdaCoin size="sm" />
            <div>
              <span className="font-medium">AIDA Usage:</span>
              <p className="text-gray-600">1 token per premium AIDA conversation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            Secure Payment Processing & No Commitment
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Your payment is encrypted and secure. Top-up anytime with no monthly commitments. 
          Tokens never expire once purchased.
        </p>
      </div>
    </div>
  );
};

export default BuyTokensPage;