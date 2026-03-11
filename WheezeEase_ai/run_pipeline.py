"""
Main pipeline script to run all steps
"""

import sys
import os

def run_pipeline():
    """Execute the complete AI pipeline"""
    
    print("="*70)
    print(" " * 15 + "WHEEZEEASE AI PIPELINE")
    print("="*70)
    print("\nThis script will execute all steps:")
    print("  1. Data Collection")
    print("  2. Data Preparation")
    print("  3. Model Training")
    print("  4. Model Evaluation")
    print("\nTotal estimated time: 5-10 minutes\n")
    
    input("Press Enter to start...")
    
    steps = [
        ("src/1_data_collection.py", "Data Collection"),
        ("src/2_data_preparation.py", "Data Preparation"),
        ("src/3_model_training.py", "Model Training"),
        ("src/4_model_evaluation.py", "Model Evaluation")
    ]
    
    for script, name in steps:
        print(f"\n\n{'='*70}")
        print(f"Executing: {name}")
        print('='*70)
        
        exit_code = os.system(f"python {script}")
        
        if exit_code != 0:
            print(f"\n✗ Error in {name}. Pipeline stopped.")
            return False
    
    print("\n\n" + "="*70)
    print(" " * 20 + "✓ PIPELINE COMPLETED")
    print("="*70)
    print("\nAll models trained and evaluated successfully!")
    print("\nNext steps:")
    print("  1. Test Environmental API: python src/5_environmental_api.py")
    print("  2. Start API Server: python src/6_api_service.py")
    print("  3. Test API: python tests/test_api.py")
    print("\nFiles generated:")
    print("  • data/raw/training_data.csv")
    print("  • data/models/best_model.pkl")
    print("  • data/models/evaluation_report.txt")
    print("  • data/models/confusion_matrices.png")
    
    return True

if __name__ == "__main__":
    success = run_pipeline()
    sys.exit(0 if success else 1)
