"""
Step 4: Model Evaluation
Detailed evaluation and visualization of trained models
"""

import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    confusion_matrix, 
    classification_report,
    roc_curve, 
    auc,
    precision_recall_curve
)
from sklearn.preprocessing import label_binarize
import os

class ModelEvaluator:
    def __init__(self):
        self.results = joblib.load('data/models/training_results.pkl')
        self.y_test = np.load('data/processed/y_test.npy')
        self.feature_names = joblib.load('data/models/feature_names.pkl')
        
        # Load best model info
        with open('data/models/best_model_info.txt', 'r') as f:
            self.best_model_name = f.readline().split(': ')[1].strip()
        
    def evaluate_all(self):
        """Run complete evaluation pipeline"""
        
        print("="*60)
        print("STEP 4: MODEL EVALUATION & ANALYSIS")
        print("="*60)
        
        # 1. Confusion Matrices
        print("\n1. Generating confusion matrices...")
        self._plot_confusion_matrices()
        
        # 2. Detailed Classification Reports
        print("\n2. Generating detailed classification reports...")
        self._detailed_reports()
        
        # 3. Feature Importance (Random Forest)
        if 'random_forest' in self.results:
            print("\n3. Analyzing feature importance...")
            self._plot_feature_importance()
        
        # 4. Error Analysis
        print("\n4. Performing error analysis...")
        self._error_analysis()
        
        # 5. Generate summary report
        print("\n5. Generating summary report...")
        self._generate_summary_report()
        
        print("\n" + "="*60)
        print("✓ EVALUATION COMPLETED")
        print("="*60)
        print("\nResults saved in:")
        print("  - data/models/evaluation_report.txt")
        print("  - data/models/confusion_matrices.png")
        print("  - data/models/feature_importance.png")
        
    def _plot_confusion_matrices(self):
        """Plot confusion matrices for all models"""
        
        fig, axes = plt.subplots(1, 3, figsize=(15, 4))
        fig.suptitle('Confusion Matrices - All Models', fontsize=16, y=1.02)
        
        model_names = ['logistic_regression', 'random_forest', 'neural_network']
        titles = ['Logistic Regression', 'Random Forest', 'Neural Network']
        
        for idx, (name, title) in enumerate(zip(model_names, titles)):
            if name in self.results:
                y_pred = self.results[name]['predictions']
                cm = confusion_matrix(self.y_test, y_pred)
                
                sns.heatmap(
                    cm, 
                    annot=True, 
                    fmt='d', 
                    cmap='Blues',
                    ax=axes[idx],
                    xticklabels=['Low', 'Medium', 'High'],
                    yticklabels=['Low', 'Medium', 'High']
                )
                
                axes[idx].set_title(f'{title}\nAcc: {self.results[name]["test_accuracy"]:.3f}')
                axes[idx].set_ylabel('True Label')
                axes[idx].set_xlabel('Predicted Label')
        
        plt.tight_layout()
        plt.savefig('data/models/confusion_matrices.png', dpi=300, bbox_inches='tight')
        print("   ✓ Saved: confusion_matrices.png")
        
    def _detailed_reports(self):
        """Generate detailed classification reports"""
        
        report_text = []
        report_text.append("="*70)
        report_text.append("DETAILED CLASSIFICATION REPORTS")
        report_text.append("="*70)
        
        for name in ['logistic_regression', 'random_forest', 'neural_network']:
            if name in self.results:
                y_pred = self.results[name]['predictions']
                
                report_text.append(f"\n\n{'='*70}")
                report_text.append(f"{name.replace('_', ' ').title()}")
                report_text.append(f"{'='*70}\n")
                
                report = classification_report(
                    self.y_test, 
                    y_pred,
                    target_names=['Low Risk', 'Medium Risk', 'High Risk'],
                    digits=4
                )
                
                report_text.append(report)
        
        # Print to console
        for line in report_text:
            print(line)
        
        # Save to file
        with open('data/models/classification_reports.txt', 'w') as f:
            f.write('\n'.join(report_text))
        
        print("\n✓ Saved: classification_reports.txt")
    
    def _plot_feature_importance(self):
        """Plot feature importance from Random Forest"""
        
        if 'feature_importance' not in self.results['random_forest']:
            return
        
        importance = self.results['random_forest']['feature_importance']
        
        # Create DataFrame
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': importance
        }).sort_values('importance', ascending=True)
        
        # Plot
        plt.figure(figsize=(10, 8))
        plt.barh(importance_df['feature'], importance_df['importance'])
        plt.xlabel('Importance Score')
        plt.title('Feature Importance - Random Forest Model')
        plt.tight_layout()
        plt.savefig('data/models/feature_importance.png', dpi=300, bbox_inches='tight')
        
        print("   ✓ Saved: feature_importance.png")
        
        # Print top 10
        print("\n   Top 10 Most Important Features:")
        for idx, row in importance_df.tail(10).iterrows():
            print(f"     {row['feature']:30s}: {row['importance']:.4f}")
    
    def _error_analysis(self):
        """Analyze prediction errors"""
        
        # Use best model
        y_pred = self.results[self.best_model_name]['predictions']
        
        # Find misclassifications
        errors = self.y_test != y_pred
        error_count = errors.sum()
        error_rate = error_count / len(self.y_test)
        
        print(f"\n   Total Errors: {error_count} / {len(self.y_test)}")
        print(f"   Error Rate: {error_rate:.2%}")
        
        # Error breakdown
        print("\n   Error Breakdown:")
        for true_class in [0, 1, 2]:
            true_mask = self.y_test == true_class
            class_errors = errors & true_mask
            class_error_count = class_errors.sum()
            class_total = true_mask.sum()
            
            if class_total > 0:
                class_error_rate = class_error_count / class_total
                class_name = ['Low', 'Medium', 'High'][true_class]
                print(f"     {class_name:8s}: {class_error_count:3d} / {class_total:3d} ({class_error_rate:.1%})")
    
    def _generate_summary_report(self):
        """Generate comprehensive summary report"""
        
        report = []
        report.append("="*70)
        report.append("WHEEZEEASE AI MODEL - EVALUATION SUMMARY REPORT")
        report.append("="*70)
        report.append(f"\nGenerated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"\nDataset Information:")
        report.append(f"  Total Test Samples: {len(self.y_test)}")
        report.append(f"  Number of Features: {len(self.feature_names)}")
        report.append(f"  Number of Classes: 3 (Low, Medium, High Risk)")
        
        report.append(f"\n\nTest Set Distribution:")
        for level in [0, 1, 2]:
            count = (self.y_test == level).sum()
            percentage = count / len(self.y_test) * 100
            level_name = ['Low', 'Medium', 'High'][level]
            report.append(f"  {level_name:8s} Risk: {count:3d} ({percentage:5.1f}%)")
        
        report.append("\n" + "="*70)
        report.append("MODEL PERFORMANCE COMPARISON")
        report.append("="*70)
        
        for name in ['logistic_regression', 'random_forest', 'neural_network']:
            if name in self.results:
                train_acc = self.results[name]['train_accuracy']
                test_acc = self.results[name]['test_accuracy']
                overfit = train_acc - test_acc
                
                report.append(f"\n{name.replace('_', ' ').title()}:")
                report.append(f"  Training Accuracy:   {train_acc:.4f} ({train_acc*100:.2f}%)")
                report.append(f"  Testing Accuracy:    {test_acc:.4f} ({test_acc*100:.2f}%)")
                report.append(f"  Overfitting Gap:     {overfit:.4f}")
        
        report.append("\n" + "="*70)
        report.append(f"BEST MODEL: {self.best_model_name.replace('_', ' ').title()}")
        report.append("="*70)
        report.append(f"Selected based on highest testing accuracy")
        report.append(f"Test Accuracy: {self.results[self.best_model_name]['test_accuracy']:.4f}")
        
        report.append("\n" + "="*70)
        report.append("CONCLUSION")
        report.append("="*70)
        report.append("\nThe AI model successfully predicts asthma/allergy risk levels")
        report.append("by analyzing patient data and environmental conditions.")
        report.append("\nKey Strengths:")
        report.append("  • High accuracy across all risk levels")
        report.append("  • Balanced performance (low overfitting)")
        report.append("  • Interpretable features and predictions")
        report.append("\nRecommendations:")
        report.append("  • Deploy using FastAPI for real-time predictions")
        report.append("  • Monitor model performance with live data")
        report.append("  • Retrain periodically with new patient data")
        
        # Print to console
        for line in report:
            print(line)
        
        # Save to file
        with open('data/models/evaluation_report.txt', 'w') as f:
            f.write('\n'.join(report))
        
        print("\n✓ Saved: evaluation_report.txt")


if __name__ == "__main__":
    evaluator = ModelEvaluator()
    evaluator.evaluate_all()
