import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCreditCard, FiLock } from 'react-icons/fi'

const Payment = () => {
  const { courseId } = useParams()
  const [paymentMethod, setPaymentMethod] = useState('card')

  // In a real app, fetch course details based on courseId
  const course = {
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Mohammed Bennani",
    price: 899,
    discountPrice: 199,
    image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600"
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="heading-lg mb-4">Complete Your Purchase</h1>
            <p className="text-neutral-600">
              Secure payment for your course
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Course Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-card">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    By {course.instructor}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-secondary">
                      {course.discountPrice} MAD
                    </span>
                    <span className="ml-2 text-sm line-through text-neutral-500">
                      {course.price} MAD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-card">
                <div className="mb-8">
                  <h3 className="font-heading text-xl font-semibold mb-4">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className={`p-4 border rounded-lg flex items-center justify-center transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-300 hover:border-primary'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <FiCreditCard className={`mr-2 ${
                        paymentMethod === 'card' ? 'text-primary' : 'text-neutral-500'
                      }`} />
                      <span className={paymentMethod === 'card' ? 'text-primary' : 'text-neutral-700'}>
                        Credit Card
                      </span>
                    </button>
                    <button
                      className={`p-4 border rounded-lg flex items-center justify-center transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-300 hover:border-primary'
                      }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <span className={paymentMethod === 'paypal' ? 'text-primary' : 'text-neutral-700'}>
                        PayPal
                      </span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' ? (
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <FiCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <FiLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="Full name on card"
                          className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="btn-primary w-full py-4">
                        Pay {course.discountPrice} MAD
                      </button>
                      <p className="text-center text-sm text-neutral-600 mt-4 flex items-center justify-center">
                        <FiLock className="mr-2" />
                        Your payment is secure and encrypted
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <button className="btn-primary w-full py-4">
                      Continue with PayPal
                    </button>
                    <p className="text-sm text-neutral-600 mt-4">
                      You will be redirected to PayPal to complete your purchase
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment