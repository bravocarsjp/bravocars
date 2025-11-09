import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Upload, CheckCircle2 } from 'lucide-react';

const SellCarPage = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    reservePrice: '',
    description: '',
    vin: '',
    color: '',
    transmission: '',
    fuelType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Your car listing has been submitted for review. We will contact you within 24-48 hours.');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-black">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Sell Your <span className="text-amber-500">Luxury Car</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Reach thousands of qualified buyers worldwide. List your vehicle and let us handle the rest.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-amber-500/20 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">No Upfront Fees</h3>
              <p className="text-gray-400 text-sm">Only pay commission when your car sells</p>
            </div>
            <div className="bg-zinc-900 border border-amber-500/20 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Global Reach</h3>
              <p className="text-gray-400 text-sm">Access to international luxury car buyers</p>
            </div>
            <div className="bg-zinc-900 border border-amber-500/20 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-400 text-sm">Protected escrow system for safe transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-zinc-900 border border-amber-500/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">Vehicle Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="make" className="text-gray-300">Make *</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Ferrari"
                    value={formData.make}
                    onChange={(e) => handleChange('make', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model" className="text-gray-300">Model *</Label>
                  <Input
                    id="model"
                    placeholder="e.g., 488 GTB"
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="year" className="text-gray-300">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mileage" className="text-gray-300">Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="12,450"
                    value={formData.mileage}
                    onChange={(e) => handleChange('mileage', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="color" className="text-gray-300">Color *</Label>
                  <Input
                    id="color"
                    placeholder="Rosso Corsa"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-gray-300">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)}>
                    <SelectTrigger className="bg-zinc-800 border-amber-500/20 text-white mt-2">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Transmission *</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleChange('transmission', value)}>
                    <SelectTrigger className="bg-zinc-800 border-amber-500/20 text-white mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Fuel Type *</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleChange('fuelType', value)}>
                    <SelectTrigger className="bg-zinc-800 border-amber-500/20 text-white mt-2">
                      <SelectValue placeholder="Select fuel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* VIN and Reserve Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vin" className="text-gray-300">VIN Number *</Label>
                  <Input
                    id="vin"
                    placeholder="17 character VIN"
                    value={formData.vin}
                    onChange={(e) => handleChange('vin', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reservePrice" className="text-gray-300">Reserve Price (USD) *</Label>
                  <Input
                    id="reservePrice"
                    type="number"
                    placeholder="150000"
                    value={formData.reservePrice}
                    onChange={(e) => handleChange('reservePrice', e.target.value)}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your vehicle's features, history, condition, and any modifications..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2 min-h-32"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label className="text-gray-300">Photos *</Label>
                <div className="mt-2 border-2 border-dashed border-amber-500/30 rounded-lg p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="text-white font-semibold mb-1">Click to upload photos</p>
                  <p className="text-gray-400 text-sm">Upload at least 10 high-quality photos (JPG, PNG)</p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-6 text-lg">
                  Submit for Review
                </Button>
                <p className="text-gray-400 text-sm text-center mt-4">
                  Our team will review your submission within 24-48 hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellCarPage;
